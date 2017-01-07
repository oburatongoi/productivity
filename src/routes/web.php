<?php

// Route::fakeIdModel('folder', 'Oburatongoi\Productivity\Folder');
// Route::fakeIdModel('list', 'Oburatongoi\Productivity\List');
// Route::fakeIdModel('note', 'Oburatongoi\Productivity\Note');
// Route::fakeIdModel('goal', 'Oburatongoi\Productivity\Goal');


Route::get('productivity', function(){
    echo 'works';
});

Route::resource('folder', 'OburaTongoi\Productivity\Http\Controllers\FolderController');
