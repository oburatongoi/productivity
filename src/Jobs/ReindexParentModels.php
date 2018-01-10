<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Database\Eloquent\Model as ChildModel;
use AlgoliaSearch\AlgoliaException;
use Bugsnag, Exception;

class ReindexParentModels implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $model;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(ChildModel $model)
    {
        $this->model = $model;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try {
          $class = get_class($this->model);
          switch ($class) {
            case 'Oburatongoi\Productivity\Folder':
              if ($this->model->parent_id) return $this->model->folder->searchable();
              break;
            case 'Oburatongoi\Productivity\Checklist':
              if ($this->model->folder_id) return $this->model->folder->searchable();
              break;
            case 'Oburatongoi\Productivity\ChecklistItem':
              // if ($this->model->parent_id) return $this->model->parent->searchable();
              if ($this->model->checklist_id) return $this->model->checklist->searchable();
              break;
          }

        } catch (AlgoliaException $exception) {
          Bugsnag::notifyException($exception);
        } catch (Exception $exception) {
          Bugsnag::notifyException($exception);
        }
    }

    /**
     * The job failed to process.
     *
     * @param  Exception  $exception
     * @return void
     */
    public function failed(Exception $exception)
    {
        Bugsnag::notifyException($exception);
    }
}
