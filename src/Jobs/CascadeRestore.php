<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Database\Eloquent\Model as Model;
use AlgoliaSearch\AlgoliaException;
use Bugsnag, Exception;

class CascadeRestore implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $model;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Model $model)
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
              $this->model->subfolders()->restore();
              $this->model->checklists()->restore();
              break;
            case 'Oburatongoi\Productivity\Checklist':
              $this->model->items()->restore();
              break;
            case 'Oburatongoi\Productivity\ChecklistItem':
              $this->model->child_list_items()->restore();
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
