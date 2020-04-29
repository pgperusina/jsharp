/**
 * JSharp parser
 */

/* Lexical definition */
%lex

%options case-insensitive

%%

/* White spaces */
[ \r\t]+            {}
\n                  {}

/* Comments */
"//".*                             	 	{
                                            console.log("comment one line");
                                            //console.log(yytext);
                                        }
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]     {
                                            console.log("comment ML");
                                            //console.log(yytext);
                                        }

"null"				return 'NULL';
"integer"			return 'INTEGER';
"double"			return 'DOUBLE';
"char"				return 'CHAR';
"boolean"			return 'BOOLEAN';
"import"			return 'IMPORT';
"var"				return 'VAR';
"const"				return 'CONST';
"global"			return 'GLOBAL';
"true"				return 'TRUE';
"false"				return 'FALSE';
"if"				return 'IF';
"else"				return 'ELSE';
"switch"			return 'SWITCH';
"case"				return 'CASE';
"default"			return 'DEFAULT';
"break"				return 'BREAK';
"continue"			return 'CONTINUE';
"return"			return 'RETURN';
"print"				return 'PRINT';
"public"			return 'PUBLIC';
"private"			return 'PRIVATE';
"void"				return 'VOID';
"for"				return 'FOR';
"while"				return 'WHILE';
"define"			return 'DEFINE';
"as"				return 'AS';
"strc"				return 'STRC';
"do"				return 'DO';
"try"				return 'TRY';
"catch"				return 'CATCH';
"throw"				return 'THROW';

","                 return 'COMA';
"."                 return 'PUNTO';
";"                 return 'PCOMA';
"("                 return 'PARIZQ';
")"                 return 'PARDER';
"["                 return 'CORIZQ';
"]"                 return 'CORDER';
"{"                 return 'LLAVIZQ';
"}"                 return 'LLAVDER';
":="                return 'DPIGUAL';
":"                 return 'DOSPUNTOS';
"++"                return 'OPINCREMENTO';
"+"                 return 'MAS';
"--"                return 'OPDECREMENTO';
"-"                 return 'MENOS';
"*"                 return 'POR';
"/"                 return 'DIVIDIDO';
"%"                 return 'MODULO';
"^^"                return 'POWER';
"^"              	return 'XOR';
"||"             	return 'OR';
"&&"            	return 'AND';
"==="               return 'TRIPLEIGUAL';
"=="                return 'IGUALA';
"!="                return 'DIFERENTEDE';
"<="                return 'MENORIGUAL';
">="                return 'MAYORIGUAL';
"="                 return 'IGUAL';
">"                	return 'MAYOR';
"<"                	return 'MENOR';
"!"                	return 'NOT';

\"[^\"]*\"				    { 
								yytext = yytext.substr(1,yyleng-2); return 'CADENA'; 
							}
\'[a-zA-ZñÑ^\']\'				    { 
								yytext = yytext.substr(1,yyleng-2); return 'CARACTER'; 
							}
[0-9]+("."[0-9]+)\b         return 'DECIMAL';
[0-9]+\b                    return 'ENTERO';
([a-zA-Z0-9\.\-ñÑ])+[j]		return 'ARCHIVO';
([a-zA-Z_])[a-zA-Z0-9_ñÑ]*	return 'IDENTIFICADOR';


<<EOF>>                     return 'EOF';
.                           { 
								console.error('Error Léxico: ' + yytext + 
								', en la linea: ' + yylloc.first_line + ', y la columna: ' + yylloc.first_column); 
							}
							
/lex

/* Precedence and association */
%right OPINCREMENTO OPDECREMENTO
%left AND
%left OR
%left XOR
%left IGUALA DIFERENTEDE TRIPLEIGUAL
%nonassoc MENOR MAYOR MENORIGUAL MAYORIGUAL
%left MAS MENOS
%left POR DIVIDIDO MODULO
%right POWER
%right UMENOS NOT

%start initial

%% /* Grammar definition */

initial
	: instrucciones EOF
;

instrucciones
	: instrucciones instruccion {
		$$ = $1;
		$$.push($2);
	}
	| instruccion {
		$$ = [$1];
	}
;

instruccion
	: imports PCOMA { 
		$$ = $1;
		console.log("INSTRUCCION IMPORTS " + $1);
	}
	| declaracion PCOMA {
		$$ = $1;
		//console.log("declaracion");
	}
	| if {
		$$ = $1;
	}
	| switch {
		$$ = $1;
	}

	/*| error PCOMA { 
			console.error('Error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.last_column); 
			//$$ = "ERROR"
		}*/
;


imports
	: IMPORT import  {
			$$ = $2;
			//todo crear nodo (import)
		}
;

import
	: import COMA ARCHIVO {
			$$ = $1;
			$$.push($3);
		}
	| ARCHIVO {
			$$ = [$1];
		}
;

declaracion
	: type lista_id IGUAL expresion {
		$$ = $1 + " " + $2 + " = " + $4;
		console.log("declaracion 1 --" + $1 + " " + $2 + " = " + $4);
		// todo - crear nodo declaracion
	}
	| ids_anidados IGUAL expresion {
		$$ = $1 + $2 + $3;
		console.log("ASIGNACION -- " + $1 + $2 + $3);
		// todo - crear nodo ASIGNACION
	}
	| VAR IDENTIFICADOR DPIGUAL expresion {
		$$ = $1 + " " + $2 + " := " + $4;
		console.log("declaracion 2 --" + $1 + " " + $2 + " := " + $4);
		// todo - crear nodo declaracion
	}
	| CONST IDENTIFICADOR DPIGUAL expresion {
		$$ = $1 + " " + $2 + " := " + $4;
		console.log("declaracion 3 --" + $1 + " " + $2 + " := " + $4);
		// todo - crear nodo declaracion
	}
	| GLOBAL IDENTIFICADOR DPIGUAL expresion {
		$$ = $1 + " " + $2 + " := " + $4;
		console.log("declaracion 4 --" + $1 + " " + $2 + " := " + $4);
		// todo - crear nodo declaracion
	}
	| type lista_id {
		$$ = $1 + " " +  $2;
		console.log("declaracion 5 --" + $1 + " " +  $2);
		// todo - crear nodo declaracion
	}
;

type
	: tipo CORIZQ CORDER {
		$$ = $1 + $2 + $3;
		// todo - crear nodo tipo diferenciando array de variable
	}
	| tipo {
		$$ = $1;
		// todo - crear nodo tipo diferenciando array de variable
	}
;

tipo
	: INTEGER {
		$$ = $1;
	}
	| DOUBLE {
		$$ = $1;
	}
	| CHAR {
		$$ = $1;
	}
	| BOOLEAN {
		$$ = $1;
	}
	| ids_anidados {
		$$ = $1;
	}
;

ids_anidados
	: ids_anidados PUNTO IDENTIFICADOR {
		console.log("IDS_ANIDADOS -- " +$1 + $2 + $3);
		$$ =$1;
		$$.push($3);
	}
	| IDENTIFICADOR {
		console.log("IDENTIFICADOR IDS_ANIDADOS -- " +$1);
		$$ = [$1];
	}
;

lista_id
	: lista_id COMA IDENTIFICADOR {
		$$ = $1;
		$$.push($3);
	}
	| IDENTIFICADOR {
		$$ = [$1];
	}
;

if
	: IF PARIZQ expresion PARDER bloqueInstrucciones { 
			console.log("IF -- " + $1 + " " + $3);
			// todo -- crear nodo de if
		}
	| IF PARIZQ expresion PARDER bloqueInstrucciones ELSE  if { 
			console.log("IF ELSE IF -- " + $1 + " " + $3 + " ELSE IF ");
			// todo -- crear nodo de if
		}
	| IF PARIZQ expresion PARDER bloqueInstrucciones ELSE bloqueInstrucciones { 
			console.log("IF ELSE -- " + $1 + " " + $3 + " ELSE ");
			// todo -- crear nodo de if
		}
	| error PCOMA { 
			console.error('Error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.last_column); 
			//$$ = "ERROR"
		}
;

switch
	: SWITCH PARIZQ expresion PARDER LLAVIZQ cases LLAVDER {
		console.log($1 + " " + $3 + " " + $6);
		// todo - crear nodo switch
	}
;

cases
	: cases case {
		$$ = $1;
		$$.push($2);
	}
	| case {
		$$ = [$1];
	}
; 

case
	: CASE expresion DOSPUNTOS instrucciones {
		$$ = $1 + " " + $2 + " " + $3 + " " + $4;
		// todo - crear nodo case
	}
	| DEFAULT DOSPUNTOS instrucciones {
		$$ = $1 + " " + $2 + " " + $3;
		// todo - crear nodo case default
	}
;

bloqueInstrucciones
	: LLAVIZQ instrucciones LLAVDER {
		// todo -- crear lista de instrucciones
		console.log("BLOQUE INSTRUCCIONES -- " + $2);
	}
;

expresion
	: expresion OPINCREMENTO    	{ $$ = $1 + 1; }
	| expresion OPDECREMENTO    	{ $$ = $1 - 1; }
	| expresion MAS expresion       { $$ = $1 + $3; }
	| expresion MENOS expresion     { $$ = $1 - $3; }
	| expresion POR expresion       { $$ = $1 * $3; }
	| expresion DIVIDIDO expresion  { $$ = $1 / $3; }
	| expresion MODULO expresion  	{ $$ = $1 % $3; }
	| expresion POWER expresion		{ $$ = $1 * $1; /* todo - logica para power */}
	| expresion XOR expresion		{ $$ = $1 ^ $3; }
	| expresion OR expresion		{ $$ = $1 || $3; }
	| expresion AND expresion		{ $$ = $1 && $3; }
	| expresion MENORIGUAL expresion	{ $$ = $1 <= $3; }
	| expresion MAYORIGUAL expresion	{ $$ = $1 >= $3; }
	| expresion MENOR expresion		{ $$ = $1 < $3; }
	| expresion MAYOR expresion		{ $$ = $1 > $3; }
	| expresion IGUALA expresion	{ $$ = $1 == $3; }
	| expresion TRIPLEIGUAL expresion	{ $$ = $1 === $3; }
	| expresion DIFERENTEDE expresion	{ $$ = $1 != $3; }
	| MENOS expresion %prec UMENOS  { $$ = $2 *-1; }
	| NOT expresion					 { $$ = !$2; }
	| ENTERO                        { $$ = Number($1); }
	| DECIMAL                       { $$ = Number($1); }
	| TRUE                      	{ $$ = Boolean($1); }
	| FALSE                       	{ $$ = Boolean($1); }
	| IDENTIFICADOR					{ $$ = $1; }
	| CADENA {
		$$ = $1;
	}
	|CARACTER {
		$$ = $1;
	}
	| PARIZQ expresion PARDER       { $$ = $2; }
	/*|  error   {
		console.error('Error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.last_column); 
	}*/
;