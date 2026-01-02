import { NextRequest, NextResponse } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, telegram, otherContact, preferredContact, monthlyPrice, message } = await request.json();

    // Basic validation
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId1 = process.env.TELEGRAM_CHAT_ID1;
    const chatId2 = process.env.TELEGRAM_CHAT_ID2;

    if (!token || !chatId1 || !chatId2) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Initialize bot with polling disabled (we only send messages)
    const bot = new TelegramBot(token, { polling: false });

    const text = `Новый лид с лендинга!\nИмя: ${name || 'Не указано'}\nEmail: ${email}\nТелефон: ${phone || 'Не указано'}\nTelegram: ${telegram || 'Не указано'}\nДругой контакт: ${otherContact || 'Не указано'}\nПредпочитаемый метод связи: ${preferredContact || 'Не указано'}\nГотов платить ежемесячно: ${monthlyPrice || 'Не указано'}\nСообщение: ${message || 'Нет'}`;

    const sendMessage = async (chatId: string) => {
      try {
        await bot.sendMessage(chatId, text);
        return true;
      } catch (error) {
        console.error(`Failed to send message to ${chatId}:`, error);
        return false;
      }
    };

    const [success1, success2] = await Promise.all([sendMessage(chatId1), sendMessage(chatId2)]);

    if (!success1 || !success2) {
      return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in submit-lead:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
