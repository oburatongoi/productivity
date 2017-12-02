@extends('productivity::layouts.main')

@section('top-nav')
    <top-nav current-view="checklistsIndex"></top-nav>
@endsection

@section('main-menu')
    <main-menu logo="{{config('productivity.logo')}}"></main-menu>
@endsection

@section('content')
    <checklists></checklists>
@endsection
