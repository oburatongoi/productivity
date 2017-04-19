<?php
return [
    /*
    |--------------------------------------------------------------------------
    | Subdomain Prefix
    |--------------------------------------------------------------------------
    |
    | Specify which domain you would like Productivity to use
    |
    */

    'domain' => env('PRODUCTIVITY_DOMAIN', ''),

    /*
    |--------------------------------------------------------------------------
    | Subdomain Prefix
    |--------------------------------------------------------------------------
    |
    | Specify which domain you would like Productivity to use
    |
    */

    'subdomain' => env('PRODUCTIVITY_SUBDOMAIN', 'productivity'),

    /*
    |--------------------------------------------------------------------------
    | Scout index to use when searching folders
    |--------------------------------------------------------------------------
    |
    | Specify which index you would like Productivity to use
    |
    */
    'folder_index_name' => env('FOLDER_INDEX_NAME'),

    /*
    |--------------------------------------------------------------------------
    | Scout index to use when searching checklists
    |--------------------------------------------------------------------------
    |
    | Specify which index you would like Productivity to use
    |
    */
    'checklist_index_name' => env('CHECKLIST_INDEX_NAME'),

];
