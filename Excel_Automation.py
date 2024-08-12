import pandas as pd
import os
import numpy as np
import sys
from io import BytesIO

def write_sentence_to_file(input_filename, output_filename):
    """
    Writes a sentence to a file.

    Args:
        sentence: The sentence to write.
        filename: The name of the file to write to.
        append: True if the sentence should be appended to the end of the file,
        False if it should overwrite the existing content (default).
    """
    xl = pd.ExcelFile(input_filename)

    # See all sheet names
    sheet_names = xl.sheet_names

    # Last sheet name
    last_sheet = sheet_names[-1]

    # Read a last sheet to DataFrame
    xl.parse(last_sheet)

    # df = pd.read_excel(xl)
    df = pd.read_excel(input_filename, sheet_name=last_sheet, header = None)
    # df.drop(len(df.columns)-1, axis=1)
    print("data", df)
    
    date = ""
    month = ""
    currency = ""
    nl = True
    actual = ""

    def variable_assign(df, i, number, variable):
        if (df.loc[i][number] == " "):
            variable = ""
        elif isinstance(df.loc[i][number], float):
            variable = ""
            if (np.isnan(df.loc[i][number]) != True): 
                if float.is_integer(df.loc[i][number]*100):
                    variable = f"{int(df.loc[i][number]*100)}%"
                else:
                    variable = f"{df.loc[i][number]*100}%"
        else:
            variable = df.loc[i][number]
        return variable
    
    with open(output_filename, "w") as f:
        # JSON_STRING = "{\"calendar\" : ["
        JSON_STRING = "{% set calendar = ["
        # f.write("{% set calendar = [")
        for i in range(len(df)):
            # print(i)
            if isinstance(df.loc[i][1], str):
                currency = df.loc[i][1].strip()
            elif isinstance(df.loc[i][1], float):
                currency = ""
            actual = variable_assign(df, i , 3, "")
            forecast = variable_assign(df, i , 4, "")
            previous = variable_assign(df, i , 5, "")
            if type(df.loc[i][0]) == float:
                if (np.isnan(df.loc[i][0])) & (nl == False):
                    # f.write("")
                    JSON_STRING = JSON_STRING + ""
                    nl = True
            elif type(df.loc[i][0]) == str:
                if (df.loc[i][0] == " "):
                    if (nl == False):
                        # f.write("")
                        JSON_STRING = JSON_STRING + ""
                        nl = True
                elif df.loc[i][0] == "All Day":
                    nl = False
                    if (i == len(df) - 1): 
                        JSON_STRING = JSON_STRING + "\t" + "{" + f"date: \"{date}\", month: \"{month}\", time: \"{df.loc[i][0].strftime('%H:%M')}\", currency: \"({currency})\", event: \"{df.loc[i][2].strip()}\", actual: \"{actual}\", forecast: \"{forecast}\", previous: \"{previous}\"" + "},\n"
                        # JSON_STRING = JSON_STRING + "" + "{" + f"\"date\": \"{date}\", \"month\": \"{month}\", \"time\": \"{df.loc[i][0].strftime('%H:%M')}\", \"currency\": \"({currency})\", \"event\": \"{df.loc[i][2].strip()}\", \"actual\": \"{actual}\", \"forecast\": \"{forecast}\", \"previous\": \"{previous}\"" + "},"
                    else:
                        JSON_STRING = JSON_STRING + "\t" + "{" + f"date: \"{date}\", month: \"{month}\", time: \"{df.loc[i][0].strftime('%H:%M')}\", currency: \"({currency})\", event: \"{df.loc[i][2].strip()}\", actual: \"{actual}\", forecast: \"{forecast}\", previous: \"{previous}\"" + "},\n"
                        # JSON_STRING = JSON_STRING + "" + "{" + f"\"date\": \"{date}\", \"month\": \"{month}\", \"time\": \"{df.loc[i][0].strftime('%H:%M')}\", \"currency\": \"({currency})\", \"event\": \"{df.loc[i][2].strip()}\", \"actual\": \"{actual}\", \"forecast\": \"{forecast}\", \"previous\": \"{previous}\"" + "},"
                    # f.write("" + "{" + f"date: \"{date}\", month: \"{month}\", time: \"{df.loc[i][0]}\", currency: \"({currency})\", event: \"{df.loc[i][2].strip()}\", actual: \"{actual}\", forecast: \"{forecast}\", previous: \"{previous}\"" + "},")
                else:
                    text = df.loc[i][0].split(", ")
                    date = text[0][:3]
                    if text[1][-3:].isdigit():
                        month = text[1][:3] + " " + text[1][-3:]
                    elif text[1][-2:].isdigit():
                        month = text[1][:3] + " " + text[1][-2:]
                    else:
                        month = text[1][:3] + text[1][-2:]
            else:
                nl = False
                if (i == len(df) - 1): 
                    JSON_STRING = JSON_STRING + "\t" + "{" + f"date: \"{date}\", month: \"{month}\", time: \"{df.loc[i][0].strftime('%H:%M')}\", currency: \"({currency})\", event: \"{df.loc[i][2].strip()}\", actual: \"{actual}\", forecast: \"{forecast}\", previous: \"{previous}\"" + "},\n"
                    # JSON_STRING = JSON_STRING + "" + "{" + f"\"date\": \"{date}\", \"month\": \"{month}\", \"time\": \"{df.loc[i][0].strftime('%H:%M')}\", \"currency\": \"({currency})\", \"event\": \"{df.loc[i][2].strip()}\", \"actual\": \"{actual}\", \"forecast\": \"{forecast}\", \"previous\": \"{previous}\"" + "},"
                else:
                    JSON_STRING = JSON_STRING + "\t" + "{" + f"date: \"{date}\", month: \"{month}\", time: \"{df.loc[i][0].strftime('%H:%M')}\", currency: \"({currency})\", event: \"{df.loc[i][2].strip()}\", actual: \"{actual}\", forecast: \"{forecast}\", previous: \"{previous}\"" + "},\n"
                    # JSON_STRING = JSON_STRING + "" + "{" + f"\"date\": \"{date}\", \"month\": \"{month}\", \"time\": \"{df.loc[i][0].strftime('%H:%M')}\", \"currency\": \"({currency})\", \"event\": \"{df.loc[i][2].strip()}\", \"actual\": \"{actual}\", \"forecast\": \"{forecast}\", \"previous\": \"{previous}\"" + "},"
                # f.write("" + "{" + f"date: \"{date}\", month: \"{month}\", time: \"{df.loc[i][0].strftime('%H:%M')}\", currency: \"({currency})\", event: \"{df.loc[i][2].strip()}\", actual: \"{actual}\", forecast: \"{forecast}\", previous: \"{previous}\"" + "},")
        # f.write("] %}")
        JSON_STRING = JSON_STRING + "] %}"
        # JSON_STRING = JSON_STRING[:-1] + "]}"
        # JSON_CONVERTED = json.loads(JSON_STRING)
        # f.write(JSON_CONVERTED)
        # f.write(JSON_STRING)
        Outcome = "success"
        blob = BytesIO(JSON_STRING.encode('utf-8'))
        # print(blob.getvalue())
        sys.argv.append(JSON_STRING)
        # sys.argv.append(blob.getvalue())

        print(sys.argv[1], sys.argv)

# Example usage
cur_path = os.getcwd()
print(sys.argv)
python_filepath = sys.argv[0]
filename = sys.argv[1]
# filename = "Calendar"
# C:\Users\Lenovo\Desktop\VPS\Python Repo\Calendar.xlsx
output_filename = f"{filename}.txt"
input_filename = "/var/www/157.245.70.171/Calendar.xlsx"
# input_filename = "C:/Users/Lenovo/Desktop/VPS/Python Repo/Calendar.xlsx"
# input_filename = "../Calendar.xlsx"
# input_filename = "Calendar.xlsx"

# input_filename = os.path.join(f"{filename}.xlsx")
write_sentence_to_file(input_filename, output_filename)