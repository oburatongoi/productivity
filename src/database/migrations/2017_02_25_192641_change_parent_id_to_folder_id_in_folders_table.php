<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeParentIdToFolderIdInFoldersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('productivity_folders', function (Blueprint $table) {
            $table->renameColumn('parent_id', 'folder_id');
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
            $table->renameColumn('folder_id', 'parent_id');
        });
    }
}
