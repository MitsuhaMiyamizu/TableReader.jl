var documenterSearchIndex = {"docs":
[{"location":"#TableReader.jl-1","page":"TableReader.jl","title":"TableReader.jl","text":"","category":"section"},{"location":"#","page":"TableReader.jl","title":"TableReader.jl","text":"(Image: Docs Stable) (Image: Docs Latest) (Image: Build Status) (Image: Codecov)","category":"page"},{"location":"#","page":"TableReader.jl","title":"TableReader.jl","text":"TableReader.jl does not waste your time.","category":"page"},{"location":"#","page":"TableReader.jl","title":"TableReader.jl","text":"Features:","category":"page"},{"location":"#","page":"TableReader.jl","title":"TableReader.jl","text":"Carefully optimized for speed.\nTransparently decompresses gzip, xz, and zstd data.\nRead data from a local file, a remote file, or a running process.","category":"page"},{"location":"#","page":"TableReader.jl","title":"TableReader.jl","text":"Here is a quick benchmark of start-up time:","category":"page"},{"location":"#","page":"TableReader.jl","title":"TableReader.jl","text":"~/w/TableReader (master|…) $ julia\n               _\n   _       _ _(_)_     |  Documentation: https://docs.julialang.org\n  (_)     | (_) (_)    |\n   _ _   _| |_  __ _   |  Type \"?\" for help, \"]?\" for Pkg help.\n  | | | | | | |/ _` |  |\n  | | |_| | | | (_| |  |  Version 1.1.0 (2019-01-21)\n _/ |\\__'_|_|_|\\__'_|  |  Official https://julialang.org/ release\n|__/                   |\n\njulia> using TableReader\n\njulia> @time readcsv(\"data/iris.csv\");  # start-up time\n  2.301008 seconds (2.80 M allocations: 139.657 MiB, 1.82% gc time)\n\n~/w/TableReader (master|…) $ julia -q\njulia> using CSV, DataFrames\n\njulia> @time DataFrame(CSV.File(\"data/iris.csv\"));  # start-up time\n  7.443172 seconds (33.26 M allocations: 1.389 GiB, 9.05% gc time)\n\n~/w/TableReader (master|…) $ julia -q\njulia> using CSVFiles, DataFrames\n\njulia> @time DataFrame(load(\"data/iris.csv\"));  # start-up time\n 12.578236 seconds (47.81 M allocations: 2.217 GiB, 9.87% gc time)","category":"page"},{"location":"#","page":"TableReader.jl","title":"TableReader.jl","text":"And the parsing throughput of TableReader.jl is often ~1.5-3.0 times faster than those of pandas and other Julia packages. See this post for more selling points.","category":"page"},{"location":"#Installation-1","page":"TableReader.jl","title":"Installation","text":"","category":"section"},{"location":"#","page":"TableReader.jl","title":"TableReader.jl","text":"Start a new session by the julia command, hit the <kbd>]</kbd> key to change the mode, and run add TableReader in the pkg> prompt.","category":"page"},{"location":"#Usage-1","page":"TableReader.jl","title":"Usage","text":"","category":"section"},{"location":"#","page":"TableReader.jl","title":"TableReader.jl","text":"# This takes the three functions into the current scope:\n#   - readdlm\n#   - readcsv\n#   - readtsv\nusing TableReader\n\n# Read a CSV file and return a DataFrame object.\ndataframe = readcsv(\"somefile.csv\")\n\n# Automatic delimiter detection.\ndataframe = readdlm(\"somefile.txt\")\n\n# Read gzip/xz/zstd compressed files.\ndataframe = readcsv(\"somefile.csv.gz\")\n\n# Read a remote file as downloading.\ndataframe = readcsv(\"https://example.com/somefile.csv\")\n\n# Read stdout from a process.\ndataframe = readcsv(`unzip -p data.zip somefile.csv`)","category":"page"},{"location":"#","page":"TableReader.jl","title":"TableReader.jl","text":"The following parameters are available:","category":"page"},{"location":"#","page":"TableReader.jl","title":"TableReader.jl","text":"delim: specify the delimiter character\nquot: specify the quotation character\ntrim: trim space around fields\nlzstring: parse excess leading zeros as strings\nskip: skip the leading lines\nskipblank: skip blank lines\ncomment: specify the leading sequence of comment lines\ncolnames: set the column names\nnormalizenames:  \"normalize\" column names into valid Julia (DataFrame) identifier symbols\nhasheader: notify the parser the existence of a header\nchunkbits: set the size of a chunk","category":"page"},{"location":"#","page":"TableReader.jl","title":"TableReader.jl","text":"See the docstring of readdlm for more details.","category":"page"},{"location":"#Design-1","page":"TableReader.jl","title":"Design","text":"","category":"section"},{"location":"#","page":"TableReader.jl","title":"TableReader.jl","text":"TableReader.jl is aimed at users who want to keep the easy things easy.  It exports three functions: readdlm, readcsv, and readtsv. readdlm is at the core of the package, and the other two functions are a thin wrapper that calls readdlm with some default parameters; readcsv is for CSV files and readtsv is for TSV files. These functions always return a data frame object of DataFrames.jl. No other functions except the three are exported from this package.","category":"page"},{"location":"#","page":"TableReader.jl","title":"TableReader.jl","text":"Things happen transparently:","category":"page"},{"location":"#","page":"TableReader.jl","title":"TableReader.jl","text":"The functions detect compression from data so users do not need to specify any parameters to notify the fact.\nThe data types of columns are guessed from data (integers, floats, bools, dates, datetimes, strings, and missings are supported).\nIf the data source looks like a URL, it is downloaded with the curl command.\nreaddlm detects the delimiter of fields from data (of course, you can force a specific delimiter using the delim parameter).","category":"page"},{"location":"#","page":"TableReader.jl","title":"TableReader.jl","text":"The three functions takes an object as the source of tabular data to read. It may be a filename, a URL string, a command, or any kind of I/O objects.  For example, the following examples will work as you expect:","category":"page"},{"location":"#","page":"TableReader.jl","title":"TableReader.jl","text":"readcsv(\"path/to/filename.csv\")\nreadcsv(\"https://example.com/path/to/filename.csv\")\nreadcsv(`unzip -p path/to/dataset.zip filename.csv`)\nreadcsv(IOBuffer(some_csv_data))","category":"page"},{"location":"#","page":"TableReader.jl","title":"TableReader.jl","text":"To reduce memory usage, the parser reads data chunk by chunk and the data types are guessed using the buffered data in the first chunk. If the chunk size is not enough to detect the types correctly, the parser will fail when it detects unexpected data fields. You can expand the chunk size by the chunkbits parameter; the default size is chunkbits = 20, which means 2^20 bytes (= 1 MiB).  If you set the value to zero (i.e., chunkbits = 0), the parser reads the whole data file into a buffer without chunking it. This theoretically never mistakes the data types in exchange for higher memory usage.","category":"page"},{"location":"#Limitations-1","page":"TableReader.jl","title":"Limitations","text":"","category":"section"},{"location":"#","page":"TableReader.jl","title":"TableReader.jl","text":"The tokenizer cannot handle extremely long fields in a data file. The length of a token is encoded using 24-bit integer, and therefore a cell that is longer than or equal to 16 MiB will result in parsing failure. This is not likely to happen, but please be careful if, for example, there are columns that contain long strings.  Also, the size of a chunk is limited up to 64 GiB; you cannot disable chunking if the data size is larger than that.","category":"page"},{"location":"reference/#Reference-1","page":"Reference","title":"Reference","text":"","category":"section"},{"location":"reference/#","page":"Reference","title":"Reference","text":"readcsv\nreadtsv\nreaddlm","category":"page"},{"location":"reference/#TableReader.readcsv","page":"Reference","title":"TableReader.readcsv","text":"readcsv(filename, command, or IO object; delim = ',', <keyword arguments>)\n\nRead a CSV (comma-separated values) text file.\n\nThis function is the same as readdlm but with delim = ','. See readdlm for details.\n\n\n\n\n\n","category":"function"},{"location":"reference/#TableReader.readtsv","page":"Reference","title":"TableReader.readtsv","text":"readtsv(filename, command, or IO object; delim = '\\t', <keyword arguments>)\n\nRead a TSV (tab-separated values) text file.\n\nThis function is the same as readdlm but with delim = '\\t'. See readdlm for details.\n\n\n\n\n\n","category":"function"},{"location":"reference/#TableReader.readdlm","page":"Reference","title":"TableReader.readdlm","text":"readdlm(filename, command, or IO object;\n        delim = nothing,\n        quot = '\"',\n        trim = true,\n        lzstring = true,\n        skip = 0,\n        skipblank = true,\n        colnames = nothing,\n        normalizenames = false,\n        hasheader = (colnames === nothing),\n        chunkbits = 20  #= 1 MiB =#)\n\nRead a character delimited text file.\n\nreadcsv and readtsv call this function behind. To read a CSV or TSV file, consider to use these dedicated function instead.\n\nData source\n\nThe first (and the only positional) argument specifies the source to read data from there.\n\nIf the argument is a string, it is considered as a local file name or the URL of a remote file. If the name matches with r\"^\\w+://.*\" in regular expression, it is handled as a URL. For example, \"https://example.com/path/to/file.csv\" is regarded as a URL and its content is streamed using the curl command.\n\nIf the argument is a command object, it is considered as a source whose standard output is text data to read. For example, unzip -p path/to/file.zip somefile.csv can be used to extract a file from a zipped archive. It is also possible to pipeline several commands using pipeline.\n\nIf the arguments is an object of the IO type, it is considered as a direct data source. The content is read using read or other similar functions. For example, passing IOBuffer(text) makes it possible to read data from the raw text object.\n\nThe data source is transparently decompressed if the compression format is detectable. Currently, gzip, zstd, and xz are supported. The format is detected by the magic bytes of the stream header, and therefore other information such as file names does not affect the detection.\n\nParser parameters\n\ndelim specifies the field delimiter in a line.  This cannot be the same character as quot.  If delim is nothing, the parser tries to guess a delimiter from data.  Currently, the following delimiters are allowed: '\\t', ' ', '!', '\"', '#', '$', '%', '&', '\\'', '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~'.\n\nquot specifies the quotation character to enclose a field. This cannot be the same character as delim. If quot is nothing, no characters are recognized as a quotation mark. Currently, the following quotation characters are allowed: ' ', '!', '\"', '#', '$', '%', '&', '\\'', '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~'.\n\ntrim specifies whether the parser trims space (0x20) characters around a field. If trim is true, delim and quot cannot be a space character.\n\nlzstring specifies whether fields with excess leading zeros are treated as strings.  If lzstring is true, fields such as \"0003\" will be interpreted as strings instead of integers.\n\nskip specifies the number of lines to skip before reading data.  The next line just after the skipped lines is considered as a header line if the colnames parameter is not specified.\n\nskipblank specifies whether the parser ignores blank lines. If skipblank is false, encountering a blank line throws an exception.\n\ncomment specifies the leading sequence of comment lines. If it is a non-empty string, text lines that start with the sequence will be skipped as comments. The default value (empty string) does not skip any lines as comments.\n\nColumn names\n\ncolnames specifies the column names. If colnames is nothing (default), the column names are read from the first line just after skipping lines specified by skip (no lines are skipped by default). Any iterable object is allowed.\n\nnormalizenames uses 'safe' names for Julia symbols used in DataFrames. If normalizenames is false (default), the column names will be the same as the source file using basic parsing. If normalizenames is true then reserved words and characters will be removed/replaced in the column names.\n\nhasheader specified whether the data has a header line or not. The default value is colnames === nothing and thus the parser assumes there is a header if and only if no column names are specified.\n\nThe following table summarizes the behavior of the colnames and hasheader parameters.\n\ncolnames hasheader column names\nnothing true taken from the header (default)\nnothing false automatically generated (X1, X2, ...)\nspecified true taken from colnames (the header line is skipped)\nspecified false taken from colnames\n\nIf unnamed columns are found in the header, they are renamed to UNNAMED_{j} for ease of access, where {j} is replaced by the column number. If the number of header columns in a file is less than the number of data columns by one, a column name UNNAMED_0 will be inserted into the column names as the first column.  This is useful to read files written by the write.table function of R with row.names = TRUE.\n\nData types\n\nIntegers, floating-point numbers, boolean values, dates, datetimes, missings, and strings are automatically detected and converted from the text data.  The following list is the summary of the corresponding data types of Julia and the text formats described in the regular expression:\n\nInteger (Int): [-+]?\\d+\nFloat (Float64): [-+]?\\d*\\.?\\d+, [-+]?\\d*\\.?\\d+([eE][-+]?\\d+)?,                    [-+]?NaN or [-+]?Inf(inity)? (case-insensitive)\nBool (Bool): t(rue)? or f(alse)? (case-insensitive)\nDate (Dates.Date): \\d{4}-\\d{2}-\\d{2}\nDatetime (Dates.DateTime): \\d{4}-\\d{2}-\\d{2}[T ]\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?\nMissing (Missing): empty field or NA (case-sensitive)\nString (String): otherwise\n\nIntegers and floats have some overlap. The parser precedes integers over floats.  That means, if all values in a column are parsable as integers and floats, they are parsed as integers instead of floats; otherwise, they are parsed as floats. Similarly, all the types have higher precedence than strings.\n\nThe parser parameter lzstring affects interpretation of numbers. If lzstring is true, numbers with excess leading zeros (e.g., \"0001\", \"00.1\") are interpreted as strings. Fields without excess leading zeros (e.g., \"0\", \"0.1\") are interepreted as numbers regardless of this parameter.\n\nParsing behavior\n\nThe only supported text encoding of a file is UTF-8, which is the default character encoding scheme of many functions in Julia.  If you need to read text encoded other than UTF-8, it is required to wrap the data stream with an encoding conversion tool such as the iconv command or StringEncodings.jl.\n\n# Convert text encoding from Shift JIS (Japanese) to UTF8.\nreadcsv(`iconv -f sjis -t utf8 somefile.csv`)\n\nA text file will be read chunk by chunk to save memory. The chunk size is specified by the chunkbits parameter, which is the base two logarithm of actual chunk size.  The default value is 20 (i.e., 2^20 bytes = 1 MiB).  The data type of each column is guessed from the values in the first chunk.  If chunkbits is set to zero, it disables chunking and the data types are guessed from all rows. The chunk size will be automatically expanded when it is required to store long lines.\n\nA chunk cannot be larger than 64 GiB and a field cannot be longer than 16 MiB. These limits are due to the encoding method of tokens used by the tokenizer. Therefore, you cannot parse data larger than 64 GiB without chunking and fields longer than 16 MiB. Trying to read such a file will result in error.\n\n\n\n\n\n","category":"function"}]
}