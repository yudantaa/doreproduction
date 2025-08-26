<?php

return [
    'bot_token' => env('TELEGRAM_BOT_TOKEN'),
    'admin_ids' => array_filter(explode(',', env('TELEGRAM_BOT_ADMIN_IDS', ''))),
];