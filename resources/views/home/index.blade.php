@extends('productivity::layouts.main')

@section('top-nav')
    <top-nav></top-nav>
@endsection

@section('main-menu')
    <main-menu logo="{{config('productivity.logo')}}"></main-menu>
@endsection

@section('content')
    <home></home>
@endsection
