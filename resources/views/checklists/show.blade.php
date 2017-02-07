@extends('productivity::layouts.main')

@section('main-menu')
    <main-nav :selected="null"></main-nav>
@endsection

@section('content')
    <checklist></checklist>
@endsection
