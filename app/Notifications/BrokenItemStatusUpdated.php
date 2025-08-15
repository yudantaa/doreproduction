<?php

namespace App\Notifications;

use App\Models\BrokenItemReport;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BrokenItemStatusUpdated extends Notification implements ShouldQueue
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
            'message' => "Status updated for {$this->report->item->nama_barang}: {$this->report->status}",
            'url' => route('dashboard.broken-items.show', $this->report),
            'item_id' => $this->report->item_id,
            'report_id' => $this->report->id,
        ];
    }
}
