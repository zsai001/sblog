import os
import yaml
from openai import OpenAI
import telegram
from git import Repo
import json
from datetime import datetime  # Add this import

with open('config.yaml', 'r') as config_file:
    config = yaml.safe_load(config_file)

CONTENT_DIR = config['content_dir']
LANGUAGES = config['languages']
TELEGRAM_BOT_TOKEN = config['telegram_bot_token']
TELEGRAM_CHANNEL_ID = config['telegram_channel_id']
OPENAI_API_KEY = config['openai_api_key']
OPENAI_API_BASE = config['openai_api_base']

def process_content():
    ## process content posts dir
    files_to_process = []
    for root, dirs, files in os.walk(CONTENT_DIR):
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                files_to_process.append(file_path)
                print("wait to process", file_path)

    for file_path in files_to_process:
        if file_path.startswith(CONTENT_DIR) and file_path.endswith('.md'):
            try:
                if 'posts' in file_path.split(os.sep):
                    process_article(file_path)
                else:
                    process_page(file_path)
            except Exception as e:
                print(f"Error processing {file_path}: {str(e)}")
    else:
        print("No changes to commit.")

def process_page(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_lang = file_path.split('/')[-2]
    
    for lang in LANGUAGES:
        if original_lang == lang:
            continue
        
        new_lang_path = file_path.replace(f'/{original_lang}/', f'/{lang}/')
        print(f"Translating to: {new_lang_path}")
        
        if os.path.exists(new_lang_path):
            print(f"Translation already exists for {lang}: {new_lang_path}")
            continue
        
        os.makedirs(os.path.dirname(new_lang_path), exist_ok=True)
        
        # Translate the entire content at once
        translated_content = translate_page_content(content, lang)
        
        if translated_content:
            # Save the translated page
            with open(new_lang_path, 'w', encoding='utf-8') as f:
                f.write(translated_content)
            print(f"Translated page saved to: {new_lang_path}")

def translate_page_content(content, target_lang):
    client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_API_BASE)

    system_message = f"""You are a professional translator. Translate the following page content into {target_lang}. 
    Maintain the original formatting, including YAML frontmatter, Markdown syntax, and any HTML tags. 
    Do not translate variable names, URLs, or other technical content that should remain in the original language."""
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": content}
            ],
            temperature=0.3,
            max_tokens=2000
        )
        
        translated_content = response.choices[0].message.content.strip()
        return translated_content
    
    except Exception as e:
        print(f"Error in translation: {str(e)}")
        return None


def process_article(file_path):
    with open(file_path, 'r+') as f:
        content = f.read()
        frontmatter, body = parse_frontmatter(content)
        if not frontmatter:
            date = datetime.now().strftime("%Y-%m-%d")
            frontmatter = generate_frontmatter(date, body)
            if frontmatter is None:
                print(f"Error generating frontmatter for {file_path}")
                return
        try:
            datetime.strptime(file_path.split('/')[-1].split('.')[0], "%Y-%m-%d")
        except ValueError:
            new_file_name = f"{frontmatter['filename']}.md"
            new_file_path = os.path.join(os.path.dirname(file_path), new_file_name)
            os.rename(file_path, new_file_path)
            file_path = new_file_path
        # if 'telegram_id' not in frontmatter:
        #     telegram_id = publish_to_telegram(frontmatter, body)
        #     frontmatter['telegram_id'] = telegram_id
        original_lang = file_path.split('/')[-3]
        for lang in LANGUAGES:
            if original_lang == lang:
                continue
            new_lang_path = file_path.replace(f'/{original_lang}/', f'/{lang}/')
            print(new_lang_path)
            if os.path.exists(new_lang_path):
                print(f"Translation already exists for {lang}: {new_lang_path}")
                continue
            os.makedirs(os.path.dirname(new_lang_path), exist_ok=True)
            new_frontmatter = translate_frontmatter(frontmatter, lang)
            frontmatter_copy = frontmatter.copy()
            frontmatter_copy.update(new_frontmatter)
            translated_content = translate_content(body, lang)
            save_translated_article(new_lang_path, lang, frontmatter_copy, translated_content)
        # 更新原文件的frontmatter
        f.seek(0)
        f.write('---\n')
        f.write(yaml.dump(frontmatter, allow_unicode=True))
        f.write('---\n')
        f.write(body)
        f.truncate()

def parse_frontmatter(content):
    parts = content.split('---', 2)
    if len(parts) < 3:
        return {}, content.strip()
    try:
        frontmatter = yaml.safe_load(parts[1])
    except yaml.YAMLError:
        frontmatter = {}
    body = parts[2].strip()
    return frontmatter, body

def save_tag_translation(tag, translated_tag, lang_code):
    file_path = os.path.join(os.path.dirname(__file__), 'src', 'tagTranslations.json')
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            tag_translations = json.load(f)
    else:
        tag_translations = []

    # Find the existing tag entry
    tag_entry = next((entry for entry in tag_translations if entry.get('cn') == tag or entry.get(lang_code) == translated_tag), None)
    
    if tag_entry:
        tag_entry[lang_code] = translated_tag
    else:
        new_entry = {lang_code: translated_tag}
        if lang_code != 'cn':
            new_entry['cn'] = tag
        tag_translations.append(new_entry)

    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(tag_translations, f, ensure_ascii=False, indent=2)

def translate_frontmatter(frontmatter, target_lang):
    client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_API_BASE)
    
    translated_frontmatter = frontmatter.copy()
    
    fields_to_translate = ['title', 'category', 'tags', 'summary']
    
    for field in fields_to_translate:
        if field in frontmatter:
            content = frontmatter[field]
            
            if field == 'tags':
                content = ', '.join(content)
            
            system_message = f"You are a professional translator. Translate the following {field} into {target_lang}. Maintain the original meaning and style."
            
            try:
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": system_message},
                        {"role": "user", "content": content}
                    ],
                    temperature=0.3,
                    max_tokens=100
                )
                
                translated_content = response.choices[0].message.content.strip()
                
                if field == 'tags':
                    translated_tags = [tag.strip() for tag in translated_content.split(',')]
                    for original_tag, translated_tag in zip(frontmatter[field], translated_tags):
                        save_tag_translation(original_tag, translated_tag, target_lang)
                    translated_frontmatter[field] = translated_tags
                else:
                    translated_frontmatter[field] = translated_content
                
            except Exception as e:
                print(f"Error translating {field}: {str(e)}")
    
    # Ensure the filename remains in English
    if 'filename' in translated_frontmatter:
        translated_frontmatter['filename'] = frontmatter['filename']
    
    # Update the language field
    translated_frontmatter['lang'] = target_lang
    
    return translated_frontmatter

def generate_frontmatter(date, body):
    client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_API_BASE)
    prompt = f"""Based on the following article content, generate frontmatter in YAML format. Include the following fields:
    - title: A concise title for the article
    - filename: the filename is date with an short english title, with -
    - date: Today's date in YYYY-MM-DD format
    - category: A single category that best describes the article
    - tags: A list of 2-4 relevant tags
    - summary: A brief summary of the article in one or two sentences
    only the filename is english, other are content native language
    Ariticle data: {date}
    Article content:
    {body[:1000]}  # Limit to first 1000 characters to avoid token limits
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that generates YAML frontmatter for articles."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=250
        )
        frontmatter_yaml = response.choices[0].message.content.strip()
        print(frontmatter_yaml)
        # remove ```yaml and ```
        frontmatter_yaml = frontmatter_yaml.replace('```yaml', '').replace('```', '')
        frontmatter = yaml.safe_load(frontmatter_yaml)
        frontmatter['date'] = datetime.now().strftime("%Y-%m-%d")
        return frontmatter
    
    except Exception as e:
        print(f"Error generating frontmatter: {str(e)}")
        return None
    pass

def publish_to_telegram(frontmatter, body):
    # 将文章发布到Telegram
    # 返回Telegram消息ID
    bot = telegram.Bot(token=TELEGRAM_BOT_TOKEN)
    
    # 构建消息内容
    title = frontmatter.get('title', 'Untitled')
    summary = frontmatter.get('summary', '')
    category = frontmatter.get('category', '')
    tags = frontmatter.get('tags', [])
    
    message = f"*{title}*\n\n"
    if summary:
        message += f"{summary}\n\n"
    if category:
        message += f"Category: #{category}\n"
    if tags:
        message += f"Tags: {' '.join(['#' + tag for tag in tags])}\n"
    
    # 如果消息超过 Telegram 的字符限制，截断正文
    max_length = 4096 - len(message)
    if len(body) > max_length:
        body = body[:max_length-3] + "..."
    
    message += f"\n{body}"
    
    # 发送消息到 Telegram 频道
    sent_message = bot.send_message(
        chat_id=TELEGRAM_CHANNEL_ID,
        text=message,
        parse_mode='Markdown'
    )
    
    return sent_message.message_id



def translate_content(content, target_lang):
    client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_API_BASE)

    system_message = f"You are a professional translator. Translate the following text into {target_lang}. Maintain the original formatting, including Markdown syntax if present."
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": content}
            ],
            temperature=0.3,
            max_tokens=4096
        )
        
        translated_content = response.choices[0].message.content.strip()
        return translated_content
    
    except Exception as e:
        print(f"Error in translation: {str(e)}")
        return None

def save_translated_article(new_file_path, lang, frontmatter, translated_content):
    # 保存翻译后的文章到对应的语言目录
    # 获取原始文件的目录和文件名        
    # 将更新后的 frontmatter 和翻译后的内容写入新文件
    with open(new_file_path, 'w', encoding='utf-8') as f:
        f.write('---\n')
        yaml.dump(frontmatter, f, allow_unicode=True)
        f.write('---\n')
        f.write(translated_content)
    
    print(f"Translated article saved to: {new_file_path}")

if __name__ == '__main__':
    process_content()