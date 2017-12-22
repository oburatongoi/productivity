<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIndices extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::table('productivity_folders', function (Blueprint $table) {
        $table->unique('fake_id');
      });

      Schema::table('productivity_checklists', function (Blueprint $table) {
        $table->unique('fake_id');
        $table->foreign('folder_id')->references('id')->on('productivity_folders');
      });

      Schema::table('productivity_checklist_items', function (Blueprint $table) {
        $table->foreign('checklist_id')->references('id')->on('productivity_checklists');
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
        $table->dropUnique('productivity_folders_fake_id_unique');
      });

      Schema::table('productivity_checklists', function (Blueprint $table) {
        $table->dropUnique('productivity_checklists_fake_id_unique');
        $table->dropForeign(['folder_id']);
      });

      Schema::table('productivity_checklist_items', function (Blueprint $table) {
        $table->dropForeign(['checklist_id']);
      });
    }
}
