<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeLengthOfTextFieldsInChecklistItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('productivity_checklist_items', function (Blueprint $table) {
            $table->mediumText('content')->required()->change();
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
        Schema::table('productivity_checklist_items', function (Blueprint $table) {
            $table->text('content')->required()->change();
            $table->mediumText('comments')->nullable()->change();
        });
    }
}
