<?php

Route::group(['domain' => '{'.(string)(config('productivity.subdomain')).'}.'.(string)(config('productivity.domain'))], function () {

    Route::fakeIdModel('/folders', 'Oburatongoi\Productivity\Folder');
    Route::fakeIdModel('/lists', 'Oburatongoi\Productivity\Checklist');

    Route::group(['namespace' => 'Oburatongoi\Productivity\Http\Controllers'], function () {
        Route::name('productivity')->get('/', 'FolderController@home');
        // Route::name('productivity')->get('/', 'FolderController@index'); //Temporary as I work on home functionality
        Route::post('/search', 'SearchController@search');

        Route::post('/lists/{list}/add-item', 'ChecklistItemController@store');
        Route::patch('/lists/save-sort-order', 'ChecklistItemController@saveSortOrder');
        Route::patch('/lists/item/{item}/update', 'ChecklistItemController@update');
        Route::patch('/lists/item/{item}/check', 'ChecklistItemController@check');
        Route::post('/lists/item/{item}/add-sub-item', 'ChecklistItemController@storeSubItem');

        Route::resource('/folders', 'FolderController', ['except' => ['create', 'edit', 'destroy']]);
        Route::resource('/lists', 'ChecklistController', ['except' => ['create', 'edit', 'destroy']]);

        Route::post('/fetch-initial-tree', 'SelectionController@fetchInitialTree');
        Route::post('/{folder}/fetch-new-tree', 'SelectionController@fetchNewTree');

        Route::patch('/move-to-folder/{folder}', 'SelectionController@moveToFolder');
        Route::patch('/move-to-checklist/{list}', 'SelectionController@moveToChecklist');
        Route::patch('/move-to-home', 'SelectionController@moveToHome');
        Route::get('/fix-folder-tree', 'SelectionController@fixTree');
        Route::post('/selection', 'SelectionController@delete');

        Route::get('/maintenance/add-missing-fake-ids', 'Maintenance\MissingFakeIdController@addMissingFakeIds');
        Route::get('/maintenance/set-item-sort-order', 'Maintenance\ItemSortOrderController@setSortOrder');
    });

});
