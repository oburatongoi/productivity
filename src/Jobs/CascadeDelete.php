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

class CascadeDelete implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $model;
    protected $force;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Model $model, $force = false)
    {
        $this->model = $model;
        $this->force = $force;
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
              if ($this->force) {
                  $this->model->children()->forceDelete();
                  $this->model->checklists()->forceDelete();
              } else {
                  $this->model->children()->delete();
                  $this->model->checklists()->delete();
              }
              break;
            case 'Oburatongoi\Productivity\Checklist':
              if ($this->force) {
                  $this->model->items()->forceDelete();
              } else {
                  $this->model->items()->delete();
              }
              break;
            case 'Oburatongoi\Productivity\ChecklistItem':
              if ($this->force) {
                  $this->model->children()->forceDelete();
              } else {
                  $this->model->children()->delete();
              }
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
