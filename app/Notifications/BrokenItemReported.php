<?php

namespace App\Notifications;

use App\Models\BrokenItemReport;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BrokenItemReported extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public BrokenItemReport $report)
    {
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toDatabase($notifiable): array
    {
        return [
            'message' => "New broken item reported: {$this->report->item->nama_barang}",
            'url' => route('dashboard.broken-items.show', $this->report),
            'item_id' => $this->report->item_id,
            'report_id' => $this->report->id,
        ];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Broken Item Reported')
            ->line("A new broken item has been reported: {$this->report->item->nama_barang}")
            ->action('View Report', route('dashboard.broken-items.show', $this->report))
            ->line('Thank you for using our application!');
    }
}