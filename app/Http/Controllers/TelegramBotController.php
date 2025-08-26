<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramBotController extends Controller
{
    private string $botToken;
    private array $adminChatIds;

    public function __construct()
    {
        $this->botToken = config('telegrambot.bot_token');
        $this->adminChatIds = config('telegrambot.admin_ids');
    }

    public function sendMessage(string $message)
    {
        $url = "https://api.telegram.org/bot{$this->botToken}/sendMessage";
        $results = [];

        foreach ($this->adminChatIds as $chatId) {
            try {
                $response = Http::post($url, [
                    'chat_id' => $chatId,
                    'text' => $message,
                    'parse_mode' => 'HTML',
                ]);

                $results[$chatId] = $response->json();
            } catch (\Exception $e) {
                Log::error("Failed to send Telegram message to {$chatId}: " . $e->getMessage());
                $results[$chatId] = ['error' => $e->getMessage()];
            }
        }

        return response()->json([
            'success' => true,
            'sent_to' => $this->adminChatIds,
            'responses' => $results,
        ]);
    }
}