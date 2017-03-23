<?php

namespace Oburatongoi\Productivity\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;

use Oburatongoi\Productivity\Repositories\NoteRepository;
use Oburatongoi\Productivity\Note;

use JavaScript;

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
            'notes' => $notes
        ])->withTitle('Notes - Productivity - ' . env('APP_NAME', ''));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $note = $request->user()->notes()->create($request->input('note'));

        $note->fakeID();

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

        JavaScript::put([
            'note' => $note,
            'model' => 'note',
        ]);

        return view('productivity::notes.show')
                ->with('note', $note)
                ->withTitle($note->title . ' - Productivity - ' . env('APP_NAME', ''));
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
