import os
import shutil
import tkinter as tk
from tkinter import filedialog
import zipfile

outputPath = "../frontend/public/assets/"

#G:\TechnicLauncher\modpacks\tekxit-4-official
def prompt_directory():
    root = tk.Tk()
    root.withdraw()  # Hide the main Tkinter window
    root.attributes('-topmost', True)  # Bring the dialog to the front

    selected_path = filedialog.askdirectory(title="Select the minecraft installation directory")
    return selected_path

def list_files_in_directory(directory_path):
    try:
        file_list = []
        for root, dirs, files in os.walk(directory_path):
            for file in files:
                file_list.append(os.path.join(root, file))
        return file_list
    except Exception as e:
        print(f"An error occurred while listing files: {e}")
        return []

def extract_and_copy_png_files(jar_path, output_directory):
    """Extracts PNG files from /*/textures/item in a JAR file and copies them to the output directory.

    Args:
        jar_path (str): The path to the JAR file.
        output_directory (str): The directory where the PNG files should be copied.
    """
    try:
        with zipfile.ZipFile(jar_path, 'r') as jar:
            for file_name in jar.namelist():
                if not file_name.endswith('.png'):
                    continue
                splitted_file_name = file_name.split("/")
                if "textures/item" not in file_name and "textures/block" not in file_name and splitted_file_name[len(splitted_file_name)-1] not in "textures":
                    continue
                # Extract the subdirectory name (*) and the file name
                subdir = file_name.split("/")[1]
                file_base_name = os.path.basename(file_name)

                # Create the output subdirectory if it doesn't exist
                output_subdir = os.path.join(output_directory, subdir)
                print("Creating output directory "+ output_subdir)
                os.makedirs(output_subdir, exist_ok=True)

                # Extract and copy the file to the output directory
                source = jar.open(file_name)
                target_path = os.path.join(output_subdir, file_base_name)
                with open(target_path, 'wb') as target:
                    shutil.copyfileobj(source, target)
    except FileNotFoundError:
        print(f"File not found: {jar_path}")
    except zipfile.BadZipFile:
        print(f"The file is not a valid JAR file: {jar_path}")
    except Exception as e:
        print(f"An error occurred: {e}")

def main():
    print("Please select a directory in the file manager.")
    directory_path = prompt_directory()

    jar_file_paths = list_files_in_directory(f"{directory_path}\\mods\\")
    print(jar_file_paths)
    jar_file_paths.append(directory_path+"/bin/minecraft.jar")

    for jar_file_path in jar_file_paths:
        extract_and_copy_png_files(jar_file_path, outputPath)



if __name__ == "__main__":
    main()
