<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;

class FileUploadController extends Controller
{
    public function anyFileUpload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            // 'any_file' => 'required',
            'any_file' => 'required|max:2048',
        ]);

        // if($validator->fails()) {
        //     return response()->json(['error' => $validator->errors()], 422);
        // }

        if ($validator->fails()) {
            // Get the validation errors
            $errors = $validator->errors();

            // Append your custom error message
            $errors->add('any_file', 'Maximum file size to upload is 2MB (2048KB)');
        
            // Return the response with the modified errors
            return response()->json(['error' => $errors], 422);
        }

        $filenameWithExt = $request->file('any_file')->getClientOriginalName();
        // $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
        // $extension = $request->file('any_file')->getClientOriginalExtension();
        // $fileNameToStore = $filename.'_'.time().'.'.$extension;

        // $path = $request->file('any_file')->storeAs('public/files', $fileNameToStore);
        $path = $request->file('any_file')->storeAs('public/files', $filenameWithExt);
        $file_url = '/files/'.$filenameWithExt;

        return response()->json([
            'success' => 1,
            'data' => $file_url
        ]);
    }
}
