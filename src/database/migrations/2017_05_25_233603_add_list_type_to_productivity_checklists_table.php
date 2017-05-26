<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddListTypeToProductivityChecklistsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('productivity_checklists', function (Blueprint $table) {
            $table->string('list_type')->after('comments')->nullable(); // 'ch' for checked, 'ta' for task, 'nu' for numbered, and 'bu' for bulletted
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
            $table->dropColumn('list_type');
        });
    }
}
