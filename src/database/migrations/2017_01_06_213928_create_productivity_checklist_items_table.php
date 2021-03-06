<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductivityChecklistItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('productivity_checklist_items', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('fake_id')->unsigned()->nullable();
            $table->integer('checklist_id')->unsigned();
            $table->text('content')->required();
            $table->mediumText('comments')->nullable();
            $table->date('deadline')->nullable();
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
        Schema::dropIfExists('productivity_checklist_items');
    }
}
