<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductivityNotesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('productivity_notes', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('fake_id')->unsigned()->nullable();
            $table->integer('user_id')->unsigned();
            $table->integer('folder_id')->unsigned()->nullable();
            $table->text('title')->default('Untitled - ' . date('y-m-d H:i:s'));
            $table->mediumText('content')->nullable();
            $table->string('visibility')->default('me');
            $table->dateTime('published_at')->nullable();
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
        Schema::dropIfExists('productivity_notes');
    }
}
