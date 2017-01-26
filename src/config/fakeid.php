<?php
return [
    /*
    |--------------------------------------------------------------------------
    | FakeId connection settings
    |--------------------------------------------------------------------------
    |
    | Since FakeId depends on jenssegers/optimus, we need three values:
    | - A large prime number lower than 2147483647
    | - The inverse prime so that (PRIME * INVERSE) & MAXID == 1
    | - A large random integer lower than 2147483647
    |
    */
    'fakeid' => [
        'prime'   => env('FAKEID_PRIME', 1147724647),
        'inverse' => env('FAKEID_INVERSE', 1888782423),
        'random'  => env('FAKEID_RANDOM', 797444501),
    ],
];
