// This is the script that handles the hex board on the page

window.onload = init_board;

var board_lines = new Array();
var hex_info = new Array();		// Array of all hexes on the board with information
var player_turn = 1;	// Player 1 = red, player 2 = blue
var counter_selected = 0;
var board_dimension_side = 11;
var board_dimension_top = 11;

var canvas_width = 600;
var canvas_height = 400;
var board_width = 500;
var board_height = 400;
var context;
var board_canvas;
var select_box;

var red_bound_square = new Array(8);
var blue_bound_square = new Array(8);
var red_counter = new Counter();
var blue_counter = new Counter();

// Entry point
function init_board() {
	prepare_board();
    draw_board();
}

// Object initialization
function Counter() {
	this.orig_x = 0;
	this.orig_y = 0;
	this.centre_x = 0;
	this.centre_y = 0;
	this.radius = 0;
	this.start_angle = 0;
	this.end_angle = 0;
}

function BoardLocation() {
	this.owner = 0;		// 0 = none, 1 = red, 2 = blue
	this.counter = new Counter();
	this.bounds = 0;
}

// Event handlers
function handle_mouse_down(event) {
	if (!event) {
		event = window.event;
	}
	var mouse_x = event.clientX - canvas_bounding_rect.left;
	var mouse_y = event.clientY - canvas_bounding_rect.top;
	
	counter_selected = get_selected_counter(mouse_x, mouse_y);
	if (counter_selected != player_turn) {
		counter_selected = 0;
		return false;
	}
}

function handle_mouse_up(event) {
	counter_selected = 0;

	if (player_turn == 1) {
		calc_counter_final_pos(red_counter);
	}
	else if (player_turn == 2) {
		calc_counter_final_pos(blue_counter);
	}
}

function handle_mouse_move(event) {
	var mouse_x = event.clientX - canvas_bounding_rect.left;
	var mouse_y = event.clientY - canvas_bounding_rect.top;
	
	move_selected_counter(mouse_x, mouse_y);
}

function get_selected_counter(mouse_x, mouse_y) {
	if (test_bounding_square(red_bound_square, mouse_x, mouse_y) == true) {
		return 1;
	}
	if (test_bounding_square(blue_bound_square, mouse_x, mouse_y) == true) {
		return 2;
	}
	return 0;
}

function move_selected_counter(mouse_x, mouse_y) {
	if (counter_selected == 0) {
		return 0;
	}
	
	if (counter_selected == 1) {
		red_counter.centre_x = mouse_x;
		red_counter.centre_y = mouse_y;
	}
	else if (counter_selected == 2) {
		blue_counter.centre_x = mouse_x;
		blue_counter.centre_y = mouse_y;
	}
	redraw_all();
}

function test_bounding_square(square, coord_x, coord_y) {
	if (square.length != 8) {
		return false;
	}
	
	if (coord_x < square[0] || coord_y < square[1]) {
		return false;
	}
	if (coord_x > square[2] || coord_y < square[3]) {
		return false;
	}
	if (coord_x > square[4] || coord_y > square[5]) {
		return false;
	}
	if (coord_x < square[6] || coord_y > square[7]) {
		return false;
	}
	
	return true;
}

// Dynamic setting of board dimensions
function dimension_change_event(event) {
    var selected_option = select_box.options[select_box.selectedIndex].text;
    
    if (selected_option == "11 x 11") {
        board_dimension_side = board_dimension_top = 11
    }
    else if (selected_option == "13 x 13") { 
        board_dimension_side = board_dimension_top = 13;
    }
    else if (selected_option == "19 x 19") { 
        board_dimension_side = board_dimension_top = 19;
    }
    draw_board();
}

// Board set up and drawing
function draw_counters() {
	red_counter.centre_x = canvas_width / 4;
	red_counter.centre_y = canvas_height - 50;
	red_counter.radius = 10;
	red_counter.start_angle = 0;
	red_counter.end_angle = 2 * Math.PI;
	red_counter.orig_x = red_counter.centre_x;
	red_counter.orig_y = red_counter.centre_y;
	
	context.fillStyle = "#FF0000"
	context.beginPath();
	context.arc(red_counter.centre_x, red_counter.centre_y, red_counter.radius, 
		red_counter.start_angle, red_counter.end_angle);
	context.closePath();
	context.fill();
	context.stroke();
	
	red_bound_square = calc_counter_bounds(red_counter);
	
	blue_counter.centre_x = red_counter.centre_x;
	blue_counter.centre_y = 50;
	blue_counter.radius = red_counter.radius;
	blue_counter.start_angle = red_counter.start_angle;
	blue_counter.end_angle = red_counter.end_angle;
	blue_counter.orig_x = blue_counter.centre_x;
	blue_counter.orig_y = blue_counter.centre_y;
	
	context.fillStyle = "#0020C2";
	context.beginPath();
	context.arc(blue_counter.centre_x, blue_counter.centre_y, blue_counter.radius, 
		blue_counter.start_angle, blue_counter.end_angle);
	context.closePath();
	context.fill();
	context.stroke();
	
	blue_bound_square = calc_counter_bounds(blue_counter);
}

function clear_mouse_up(event) {
    draw_board();
}

function prepare_board() {
	board_canvas = document.getElementById("board_canvas");
	context = board_canvas.getContext("2d");
	context.lineWidth = 1;
	canvas_bounding_rect = board_canvas.getBoundingClientRect();
	board_canvas.addEventListener("mousedown", handle_mouse_down, false);	// Add event listeners
	board_canvas.addEventListener("mouseup", handle_mouse_up, false);
	board_canvas.addEventListener("mousemove", handle_mouse_move, false);
    
    select_box = document.getElementById("size_select");
    var board_11 = document.getElementById("dimension_11");
    var board_13 = document.getElementById("dimension_13");
    var board_19 = document.getElementById("dimension_19");
    
    var clear_button = document.getElementById("clear_button"); 
    select_box.addEventListener("change", dimension_change_event, false);
    clear_button.addEventListener("mouseup", clear_mouse_up, false);
    
    if (board_11.selected == true) {
        board_dimension_side = board_dimension_top = 11;
    }
    else if (board_13.selected == true) { 
        board_dimension_side = board_dimension_top = 13;
    }
    else if (board_19.selected == true) { 
        board_dimension_side = board_dimension_top = 19;
    }
}
    
function draw_board() {
    player_turn = 1;    // Reset the turn to player 1
	var rhombus_base = board_width - 100;
	var rhombus_side_len = Math.sqrt((board_height * board_height) + (100 * 100));
	var rhombus_gradient = rhombus_base / 100;
	var horiz_space_per_hex = rhombus_base / board_dimension_top;
	var vert_space_per_hex = rhombus_side_len / board_dimension_side;
	
	var rhombus = new Array(
		0, canvas_height,
		rhombus_base, board_height,
		100, 0,
		board_width, 0);
	
	// Draw all the hexagons on the board
	var cur_y_top = 0;
	var cur_x_left = 200;
	var start_x_left = cur_x_left;
	var points_per_hex = 12;
	var num_hexes = board_dimension_top * board_dimension_side;
	var vert_space_div_4 = vert_space_per_hex / 4;
	var dimensions_counter = 0;
	board_lines.length = num_hexes;
    context.clearRect(0, 0, canvas_width, canvas_height);
	context.beginPath();
	for (var i = 0; i < num_hexes; i++) {
		board_lines[i] = new Array(12);
		
		board_lines[i][0] = cur_x_left;						// Top left
		board_lines[i][1] = cur_y_top + vert_space_div_4;
		context.moveTo(board_lines[i][0], board_lines[i][1]);
		
		board_lines[i][2] = cur_x_left + (horiz_space_per_hex / 2);	// Top centre
		board_lines[i][3] = cur_y_top;
		context.lineTo(board_lines[i][2], board_lines[i][3]);
		
		board_lines[i][4] = cur_x_left + horiz_space_per_hex;	// Top right
		board_lines[i][5] = cur_y_top + vert_space_div_4;
		context.lineTo(board_lines[i][4], board_lines[i][5]);
		
		board_lines[i][6] = cur_x_left + horiz_space_per_hex;	// Bottom right
		board_lines[i][7] = cur_y_top + 3 * vert_space_div_4;
		context.lineTo(board_lines[i][6], board_lines[i][7]);
		
		board_lines[i][8] = cur_x_left + (horiz_space_per_hex / 2);	// Bottom centre
		board_lines[i][9] = cur_y_top + vert_space_per_hex;
		context.lineTo(board_lines[i][8], board_lines[i][9]);
		
		board_lines[i][10] = cur_x_left;						// Bottom left
		board_lines[i][11] = cur_y_top + 3 * vert_space_div_4;
		context.lineTo(board_lines[i][10], board_lines[i][11]);
		context.lineTo(board_lines[i][0], board_lines[i][1]);
		dimensions_counter += 1;
		
		if (dimensions_counter == board_dimension_top) {
			cur_y_top += vert_space_per_hex - vert_space_div_4;
			cur_x_left = start_x_left - horiz_space_per_hex / 2;
			start_x_left = cur_x_left;
			dimensions_counter = 0;
		}
		else {
			cur_x_left += horiz_space_per_hex;
		}
	}
	context.closePath();
	context.stroke();
	draw_counters();
	calc_board_hexinfo();
}

function calc_counter_bounds(counter) {
	var bounds = new Array(8);
	bounds[0] = counter.centre_x - counter.radius;	// Top left
	bounds[1] = counter.centre_y - counter.radius;
	bounds[2] = counter.centre_x + counter.radius;	// Top right
	bounds[3] = counter.centre_y - counter.radius;
	bounds[4] = counter.centre_x + counter.radius;	// Bottom right
	bounds[5] = counter.centre_y + counter.radius;
	bounds[6] = counter.centre_x - counter.radius;	// Bottom left
	bounds[7] = counter.centre_y + counter.radius;
	
	return bounds;
}

function calc_hex_bounds(hex) {
	if (hex.length != 12) {
		return 0;
	}

	var bounds = new Array(8);
	bounds[0] = hex[0];	// Top left
	bounds[1] = hex[3];
	bounds[2] = hex[4];	// Top right
	bounds[3] = hex[3];
	bounds[4] = hex[6];	// Bottom right
	bounds[5] = hex[9];
	bounds[6] = hex[10]; // Bottom left
	bounds[7] = hex[9];
	
	return bounds;
}

function calc_board_hexinfo() {
	// generate a bounds square for all hexes on the board
	var num_hexes = board_dimension_side * board_dimension_top;
	hex_info.length = num_hexes;
	for (var i = 0; i < num_hexes; i++) {
		hex_info[i] = new BoardLocation();
		hex_info[i].bounds = calc_hex_bounds(board_lines[i]);
	}
}

function calc_counter_final_pos(counter) {
	var num_hexes = board_dimension_side * board_dimension_top;
	var outside_board = true;
	for (var i = 0; i < num_hexes; i++) {
		if (test_bounding_square(hex_info[i].bounds, counter.centre_x, counter.centre_y) == true) {
			if (hex_info[i].owner != 0) {
				outside_board = false;
				counter.centre_x = counter.orig_x;
				counter.centre_y = counter.orig_y;
				redraw_all();
			}
			else {
				outside_board = false;
				hex_info[i].owner = player_turn;
			
				hex_info[i].counter.centre_x = counter.centre_x;
				hex_info[i].counter.centre_y = counter.centre_y;
				hex_info[i].counter.radius = counter.radius;
				hex_info[i].counter.start_angle = counter.start_angle;
				hex_info[i].counter.end_angle = counter.end_angle;
			
				hex_info[i].counter.centre_x = hex_info[i].bounds[0] + ((hex_info[i].bounds[2] - hex_info[i].bounds[0]) / 2);
				hex_info[i].counter.centre_y = hex_info[i].bounds[1] + ((hex_info[i].bounds[5] - hex_info[i].bounds[1]) / 2);
				counter.centre_x = counter.orig_x;
				counter.centre_y = counter.orig_y;
				redraw_all();
				
				if (player_turn == 1) {
					player_turn = 2;
				}
				else {
					player_turn = 1;
				}
			}
			break;
		}
	}
	
	if (outside_board == true) {
		counter.centre_x = counter.orig_x;
		counter.centre_y = counter.orig_y;
		redraw_all();
	}
}

// Basic redraw with minimal calculation
function redraw_all() {
	context.clearRect(0, 0, canvas_width, canvas_height);
	var num_hexes = board_dimension_side * board_dimension_top;
	
	context.beginPath();
	for (var i = 0; i < num_hexes; i++) {
		context.moveTo(board_lines[i][0], board_lines[i][1]);
		context.lineTo(board_lines[i][2], board_lines[i][3]);
		context.lineTo(board_lines[i][4], board_lines[i][5]);
		context.lineTo(board_lines[i][6], board_lines[i][7]);
		context.lineTo(board_lines[i][8], board_lines[i][9]);
		context.lineTo(board_lines[i][10], board_lines[i][11]);
		context.lineTo(board_lines[i][0], board_lines[i][1]);
	}
	context.closePath();
	context.stroke();
	
	for (var i = 0; i < num_hexes; i++) {
		if (hex_info[i].owner == 1) {
			redraw_counter(hex_info[i].counter, "#FF0000");
		}
		else if (hex_info[i].owner == 2) {
			redraw_counter(hex_info[i].counter, "#0020C2");
		}
	}
	
	redraw_counter(red_counter, "#FF0000");
	redraw_counter(blue_counter, "#0020C2");
}

function redraw_counter(counter, colour) {
	context.fillStyle = colour;
	context.beginPath();
	context.arc(counter.centre_x, counter.centre_y, counter.radius, 
		counter.start_angle, counter.end_angle);
	context.closePath();
	context.fill();
	context.stroke();
}
