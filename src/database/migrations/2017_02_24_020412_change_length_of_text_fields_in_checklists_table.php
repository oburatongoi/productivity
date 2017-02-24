<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeLengthOfTextFieldsInChecklistsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('productivity_checklists', function (Blueprint $table) {
            $table->mediumText('title')->required()->default('Untitled - ' . date('y-m-d H:i:s'))->change();
            $table->longText('comments')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('productivity_checklists', function (Blueprint $table) {
            $table->text('title')->required()->default('Untitled - ' . date('y-m-d H:i:s'))->change();
            $table->mediumText('comments')->nullable()->change();
        });
    }
}
