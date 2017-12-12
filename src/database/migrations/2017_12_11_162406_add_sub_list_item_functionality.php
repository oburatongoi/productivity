<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSubListItemFunctionality extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('productivity_checklist_items', function (Blueprint $table) {
          $table->integer('checklist_id')->unsigned()->nullable()->change();
          $table->integer('parent_checklist_item_id')->unsigned()->nullable()->after('checklist_id');
          $table->string('child_list_item_type', 2)->default('ch')->after('parent_checklist_item_id'); // 'ch' for checked, 'ta' for task, 'nu' for numbered, and 'bu' for bulletted
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
          $table->integer('checklist_id')->unsigned()->change();
          $table->dropColumn(['parent_checklist_item_id', 'child_list_item_type']);
        });
    }
}
