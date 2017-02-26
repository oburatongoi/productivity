@extends('productivity::layouts.main')

@section('breadcrumbs')
    <breadcrumbs model="folder"></breadcrumbs>
@endsection

@section('main-menu')
    <main-nav :selected="'{{ $model }}'"></main-nav>
@endsection

@section('content')
    <folder></folder>
@endsection
