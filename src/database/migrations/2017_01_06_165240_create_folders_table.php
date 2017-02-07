<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFoldersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('folders', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('fake_id')->unsigned()->nullable();
            $table->integer('user_id')->unsigned();
            $table->string('name')->required()->default('Untitled - ' . date('y-m-d H:i:s'));
            $table->string('description')->nullable();
            $table->dateTime('published_at')->nullable();
            $table->string('visibility')->default('me');
            $table->integer('parent_id')->nullable()->index();
            $table->integer('lft')->nullable();
            $table->integer('rgt')->nullable();
            $table->integer('depth')->nullable();
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
        Schema::dropIfExists('folders');
    }
}
