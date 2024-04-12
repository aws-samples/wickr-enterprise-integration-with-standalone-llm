#!/bin/bash
# Place in /home/ec2-user/ggllm/ggllm.cpp/build/bin
#
# Instructions on how to modify this command here https://huggingface.co/TheBloke/Falcon-7B-Instruct-GGML
# Commmand will generate an output, sent it to a temporary file which will then be read by the Wickr Bot
./falcon_main  -ngl 100 -t 32 -b 1 --mlock -m falcon-7b-instruct.ggccv1.q4_0.bin -enc -p "$1" 2>/dev/null > output.txt
cat output.txt