<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeFolderIdToParentIdAndDeleteDepthInFoldersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('productivity_folders', function (Blueprint $table) {
          $table->renameColumn('folder_id', 'parent_id');
          $table->dropColumn('depth');
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
          $table->renameColumn('parent_id', 'folder_id');
          $table->integer('depth')->nullable();
        });
    }
}
