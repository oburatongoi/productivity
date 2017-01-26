<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateChecklistItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('checklist_items', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            // $table->integer('fake_id')->unsigned()->nullable();
            $table->integer('checklist_id')->unsigned();
            $table->string('content')->required();
            $table->text('comments')->nullable();
            $table->dateTime('deadline')->nullable();
            $table->dateTime('checked_at')->nullable();
            $table->boolean('is_urgent')->default(0);
            $table->boolean('is_important')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('checklist_items');
    }
}
