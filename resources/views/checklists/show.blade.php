@extends('productivity::layouts.main')

@section('breadcrumbs')
    <breadcrumbs model="checklists"></breadcrumbs>
@endsection

@section('main-menu')
    <main-nav :selected="null"></main-nav>
@endsection

@section('content')
    <checklist></checklist>
@endsection
