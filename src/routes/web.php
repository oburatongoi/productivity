<?php

Route::group(['prefix' => 'productivity'], function () {

    Route::fakeIdModel('folders', 'Oburatongoi\Productivity\Folder');
    Route::fakeIdModel('lists', 'Oburatongoi\Productivity\Checklist');
    Route::fakeIdModel('notes', 'Oburatongoi\Productivity\Note');
    Route::fakeIdModel('goals', 'Oburatongoi\Productivity\Goal');

    Route::group(['namespace' => 'Oburatongoi\Productivity\Http\Controllers'], function () {
        Route::get('/', 'FolderController@index');

        Route::resource('folders', 'FolderController', ['except' => ['create', 'edit']]);
        Route::resource('goals', 'GoalController', ['except' => ['create', 'edit']]);
        Route::resource('notes', 'NoteController', ['except' => ['create', 'edit']]);
        Route::resource('lists', 'ChecklistController', ['except' => ['create', 'edit']]);

        Route::post('lists/{list}/add-item', 'ChecklistItemController@store');
        Route::patch('lists/item/{item}/update', 'ChecklistItemController@update');
        Route::patch('lists/item/{item}/delete', 'ChecklistItemController@destroy');
        Route::patch('lists/item/{item}/check', 'ChecklistItemController@check');

        Route::post('fetch-initial-tree', 'FolderController@fetchInitialTree');
        Route::post('/{folder}/fetch-new-tree', 'FolderController@fetchNewTree');
    });

});
