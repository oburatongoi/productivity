<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ModifyNestingColumnsInChecklistItems extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('productivity_checklist_items', function (Blueprint $table) {
          $table->renameColumn('parent_checklist_item_id', 'parent_id');
          $table->renameColumn('child_list_item_type', 'sub_list_type');
          $table->dropColumn('fake_id');
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
          $table->integer('fake_id')->unsigned()->nullable();
          $table->renameColumn('sub_list_type', 'child_list_item_type');
          $table->renameColumn('parent_id', 'parent_checklist_item_id');

        });
    }
}
