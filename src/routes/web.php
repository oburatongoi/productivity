<?php

Route::group(['domain' => '{'.(string)(config('productivity.subdomain')).'}.'.(string)(config('productivity.domain'))], function () {

    Route::fakeIdModel('/folders', 'Oburatongoi\Productivity\Folder');
    Route::fakeIdModel('/lists', 'Oburatongoi\Productivity\Checklist');

    Route::group(['namespace' => 'Oburatongoi\Productivity\Http\Controllers'], function () {
        Route::name('productivity')->get('/', 'FolderController@home');
        // Route::name('productivity')->get('/', 'FolderController@index'); //Temporary as I work on home functionality
        Route::post('/search', 'SearchController@search');

        Route::post('/lists/{list}/add-item', 'ChecklistItemController@store');
        Route::patch('/lists/item/{item}/update', 'ChecklistItemController@update');
        Route::patch('/lists/item/{item}/check', 'ChecklistItemController@check');
        Route::delete('/lists/item/{item}/delete', 'ChecklistItemController@destroy');

        Route::resource('/folders', 'FolderController', ['except' => ['create', 'edit']]);
        Route::resource('/lists', 'ChecklistController', ['except' => ['create', 'edit']]);

        Route::post('/fetch-initial-tree', 'MoverController@fetchInitialTree');
        Route::post('/{folder}/fetch-new-tree', 'MoverController@fetchNewTree');

        Route::patch('/move-to-folder/{folder}', 'MoverController@moveToFolder');
        Route::patch('/move-to-checklist/{list}/item/{item}', 'MoverController@moveToChecklist');
        Route::patch('/move-to-home', 'MoverController@moveToHome');
        Route::get('/fix-folder-tree', 'MoverController@fixTree');

        Route::get('/add-missing-fake-ids', 'MissingFakeIdController@addMissingFakeIds');
    });

});
