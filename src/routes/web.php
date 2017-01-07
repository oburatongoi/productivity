<?php

Route::fakeIdModel('folder', 'Oburatongoi\Productivity\Folder');
Route::fakeIdModel('list', 'Oburatongoi\Productivity\List');
Route::fakeIdModel('note', 'Oburatongoi\Productivity\Note');
Route::fakeIdModel('goal', 'Oburatongoi\Productivity\Goal');


Route::get('productivity', function(){
    echo 'works';
});

Route::group(['namespace' => 'Oburatongoi\Productivity\Http\Controllers'], function () {
    Route::resource('folder', 'FolderController');
});
