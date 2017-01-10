<?php

namespace Oburatongoi\Productivity\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;

use Oburatongoi\Productivity\Repositories\NoteRepository;
use Oburatongoi\Productivity\Note;

class NoteController extends Controller
{
    protected $notes;

    public function __construct(NoteRepository $notes)
    {
        $this->middleware('web');
        $this->middleware('auth');

        $this->notes = $notes;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $notes = $this->notes->forUser($request->user());

        return view('productivity::notes.index')->with([
            'notes' => $notes,
            'model' => 'notes',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $note = Note::create($request->input('note'));

        return response()->json([
            'note' => $note
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, Note $note)
    {

        $this->authorize('view', $note);

        return view('productivity::notes.show')->with('note', $note);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Note $note)
    {

        $this->authorize('modify', $note);

        return response()->json([
            'note' => $note
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Note $note)
    {
        $this->authorize('modify', $note);

        $note->delete();

        return response()->json([
            'note' => $note
        ]);
    }
}
