<?php

namespace App\Services;

use Google\Client;
use Google\Service\Drive;
use Google\Service\Drive\DriveFile;
use Google\Service\Drive\Permission;
use Illuminate\Http\UploadedFile;

class GoogleDriveService
{
    private Drive $drive;
    private ?string $folderId;

    public function __construct()
    {
        $client = new Client();
        $client->setAuthConfig(base_path(config('services.google_drive.credentials_path')));
        $client->addScope(Drive::DRIVE_FILE);

        $this->drive = new Drive($client);
    }

    /**
     * Uploads a file, makes it publicly viewable, and returns
     * [ 'file_id' => ..., 'url' => ... ] for storing in your DB.
     */
    public function upload(UploadedFile $file, string $folderId): array
    {
        $driveFile = new DriveFile([
            'name'    => uniqid() . '_' . $file->getClientOriginalName(),
            'parents' => [$folderId],
        ]);

        $result = $this->drive->files->create($driveFile, [
            'data'       => file_get_contents($file->getRealPath()),
            'mimeType'   => $file->getMimeType(),
            'uploadType' => 'multipart',
            'fields'     => 'id',
        ]);

        $this->drive->permissions->create(
            $result->id,
            new Permission(['type' => 'anyone', 'role' => 'reader'])
        );

        return [
            'file_id' => $result->id,
            'url'     => "https://drive.google.com/uc?export=view&id={$result->id}",
        ];
    }

    public function delete(string $fileId): void
    {
        try {
            $this->drive->files->delete($fileId);
        } catch (\Throwable) {
        }
    }

    private function ensureFolder(): string
    {
        $result = $this->drive->files->create(new DriveFile([
            'name'     => 'supplier-images',
            'mimeType' => 'application/vnd.google-apps.folder',
        ]), ['fields' => 'id']);

        // Log this once and paste it into GOOGLE_DRIVE_FOLDER_ID so
        // you don't create a new folder on every request.
        \Log::info('Created Drive folder, add to .env as GOOGLE_DRIVE_FOLDER_ID: ' . $result->id);

        return $result->id;
    }
}