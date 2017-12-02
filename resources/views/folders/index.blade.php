@extends('productivity::layouts.main')

@section('top-nav')
    <top-nav current-view="foldersIndex"></top-nav>
@endsection

@section('main-menu')
    <main-menu logo="{{config('productivity.logo')}}"></main-menu>
@endsection

@section('content')
    <folders></folders>
@endsection
