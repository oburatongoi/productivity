<?php

Route::group(['prefix' => 'productivity'], function () {

    Route::fakeIdModel('folder', 'Oburatongoi\Productivity\Folder');
    Route::fakeIdModel('list', 'Oburatongoi\Productivity\List');
    Route::fakeIdModel('note', 'Oburatongoi\Productivity\Note');
    Route::fakeIdModel('goal', 'Oburatongoi\Productivity\Goal');


    Route::get('/', function(){
        echo 'prefix works';
    });

    Route::group(['namespace' => 'Oburatongoi\Productivity\Http\Controllers'], function () {
        Route::resource('folders', 'FolderController', ['except' => ['create', 'edit']]);
        Route::resource('goals', 'GoalController', ['except' => ['create', 'edit']]);
        Route::resource('notes', 'NoteController', ['except' => ['create', 'edit']]);
        Route::resource('lists', 'ChecklistController', ['except' => ['create', 'edit']]);
    });

});
