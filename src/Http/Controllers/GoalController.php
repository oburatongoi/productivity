<?php

namespace Oburatongoi\Productivity\Http\Controllers;

use Illuminate\Http\Request;

use Oburatongoi\Productivity\Http\Controllers\ProductivityBaseController as Controller;

use Oburatongoi\Productivity\Repositories\GoalRepository;
use Oburatongoi\Productivity\Goal;

class GoalController extends Controller
{
    protected $goals;

    public function __construct(GoalRepository $goals)
    {
        $this->middleware('web');
        $this->middleware('auth');

        $this->goals = $goals;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $goals = $this->goals->forUser($request->user());

        return view('productivity::goals.index')->with([
            'goals' => $goals,
        ])->withTitle('Goals - Productivity - ' . config('app.name'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $goal = $request->user()->goals()->create($request->input('goal'));

        $goal->fakeID();

        return response()->json([
            'goal' => $goal
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, Goal $goal)
    {

        $this->authorize('view', $goal);

        return view('productivity::goals.show')
                ->withGoal($goal)
                ->withTitle($goal->title . ' - Productivity - ' . config('app.name'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Goal $goal)
    {

        $this->authorize('modify', $goal);

        return response()->json([
            'goal' => $goal
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Goal $goal)
    {
        $this->authorize('modify', $goal);

        $goal->delete();

        return response()->json([
            'goal' => $goal
        ]);
    }
}
