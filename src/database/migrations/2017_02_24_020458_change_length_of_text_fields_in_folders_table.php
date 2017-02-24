<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeLengthOfTextFieldsInFoldersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('productivity_folders', function (Blueprint $table) {
            $table->mediumText('name')->required()->default('Untitled - ' . date('y-m-d H:i:s'))->change();
            $table->longText('description')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('productivity_folders', function (Blueprint $table) {
            $table->text('name')->required()->default('Untitled - ' . date('y-m-d H:i:s'))->change();
            $table->mediumText('description')->nullable()->change();
        });
    }
}
