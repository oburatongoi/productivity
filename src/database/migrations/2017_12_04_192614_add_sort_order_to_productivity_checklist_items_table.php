<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSortOrderToProductivityChecklistItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('productivity_checklist_items', function (Blueprint $table) {
            $table->integer('sort_order')->nullable()->after('deadline');
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
            $table->dropColumn('sort_order');
        });
    }
}
