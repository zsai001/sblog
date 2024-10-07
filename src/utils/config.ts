import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

// 定义配置的接口
interface Config {
  title?: string;
  description?: string;
  telegram_channel_id?:string;
  // 添加其他配置项...
}

export function getConfig(): Config {
  try {
    const configPath = path.join(process.cwd(), 'config.yaml');
    const configFile = fs.readFileSync(configPath, 'utf8');
    const config = yaml.load(configFile) as Config;
    return config;
  } catch (error) {
    console.error('Error reading config file:', error);
    return {};
  }
}