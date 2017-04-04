@extends('productivity::layouts.main')

@section('top-nav')
    <top-nav></top-nav>
@endsection

@section('main-menu')
    <main-nav :selected="'{{ $model }}'"></main-nav>
@endsection

@section('content')
    <goals></goals>
@endsection
