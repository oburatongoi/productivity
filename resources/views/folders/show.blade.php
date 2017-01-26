@extends('productivity::layouts.main')

@section('main-menu')
    <main-nav :selected="'{{ $model }}'"></main-nav>
@endsection

@section('content')
    <folder></folder>
@endsection
