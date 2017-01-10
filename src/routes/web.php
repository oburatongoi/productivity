<?php

Route::group(['prefix' => 'productivity'], function () {

    Route::fakeIdModel('folder', 'Oburatongoi\Productivity\Folder');
    Route::fakeIdModel('list', 'Oburatongoi\Productivity\List');
    Route::fakeIdModel('note', 'Oburatongoi\Productivity\Note');
    Route::fakeIdModel('goal', 'Oburatongoi\Productivity\Goal');

    Route::group(['namespace' => 'Oburatongoi\Productivity\Http\Controllers'], function () {
        Route::get('/', 'FolderController@index');

        Route::resource('folders', 'FolderController', ['except' => ['create', 'edit']]);
        Route::resource('goals', 'GoalController', ['except' => ['create', 'edit']]);
        Route::resource('notes', 'NoteController', ['except' => ['create', 'edit']]);
        Route::resource('lists', 'ChecklistController', ['except' => ['create', 'edit']]);
    });

});
