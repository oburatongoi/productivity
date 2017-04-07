<?php

Route::group(['prefix' => 'productivity'], function () {

    Route::fakeIdModel('folders', 'Oburatongoi\Productivity\Folder');
    Route::fakeIdModel('lists', 'Oburatongoi\Productivity\Checklist');

    Route::group(['namespace' => 'Oburatongoi\Productivity\Http\Controllers'], function () {
        Route::get('/', 'FolderController@index');
        Route::post('search', 'SearchController@search');

        Route::resource('folders', 'FolderController', ['except' => ['create', 'edit']]);
        Route::resource('lists', 'ChecklistController', ['except' => ['create', 'edit']]);

        Route::post('lists/{list}/add-item', 'ChecklistItemController@store');
        Route::patch('lists/item/{item}/update', 'ChecklistItemController@update');
        Route::patch('lists/item/{item}/check', 'ChecklistItemController@check');
        Route::delete('lists/item/{item}/delete', 'ChecklistItemController@destroy');

        Route::post('fetch-initial-tree', 'FolderController@fetchInitialTree');
        Route::post('/{folder}/fetch-new-tree', 'FolderController@fetchNewTree');

        Route::patch('move-to/{folder}', 'FolderController@moveToFolder');
        Route::patch('move-to-home', 'FolderController@moveToHome');
        Route::get('fix-folder-tree', 'FolderController@fixTree');

        Route::get('add-missing-fake-ids', 'MissingFakeIdController@addMissingFakeIds');
    });

});
