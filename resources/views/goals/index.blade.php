@extends('productivity::layouts.main')

@section('breadcrumbs')
    <breadcrumbs></breadcrumbs>
@endsection

@section('main-menu')
    <main-nav :selected="'{{ $model }}'"></main-nav>
@endsection

@section('content')
    <goals></goals>
@endsection
